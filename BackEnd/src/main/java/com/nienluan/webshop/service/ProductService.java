package com.nienluan.webshop.service;

import com.nienluan.webshop.dto.ProductCsvDTO;
import com.nienluan.webshop.dto.request.ProductRequest;
import com.nienluan.webshop.dto.request.ProductUpdateRequest;
import com.nienluan.webshop.dto.response.ProductResponse;
import com.nienluan.webshop.dto.response.ReviewProductResponse;
import com.nienluan.webshop.entity.Brand;
import com.nienluan.webshop.entity.Category;
import com.nienluan.webshop.entity.Product;
import com.nienluan.webshop.entity.Promotion;
import com.nienluan.webshop.exception.AppException;
import com.nienluan.webshop.exception.ErrorCode;
import com.nienluan.webshop.mapper.ProductMapper;
import com.nienluan.webshop.repository.BrandRepository;
import com.nienluan.webshop.repository.CategoryRepository;
import com.nienluan.webshop.repository.ProductRepository;
import com.nienluan.webshop.repository.PromotionRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ProductService {

    ProductRepository productRepository;
    ProductMapper productMapper;
    PromotionRepository promotionRepository;
    CategoryRepository categoryRepository;
    BrandRepository brandRepository;
    ReviewService reviewService;

    public ProductResponse createProduct(ProductRequest request) throws AppException {
        if (productRepository.existsByName(request.getName())) {
            throw new AppException(ErrorCode.PRODUCT_EXISTED);
        }

        // Tìm Category và Brand theo ID từ request
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_EXISTED));

        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_EXISTED));


        Product product = productMapper.toProduct(request);
        product.setCategory(category);
        product.setBrand(brand);
        if(!request.getPromotions().isEmpty()){
            Set<Promotion> promotion = new HashSet<>(promotionRepository.findAllById(request.getPromotions()));
            product.setPromotions(promotion);
        }

        return productMapper.toProductResponse(productRepository.save(product));
    }

    public Page<ProductResponse> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable)
                .map(product -> {
                    return toProductResponse(pageable, product);
                });
    }

    public ProductResponse getProduct(Pageable pageable, String id) {
        Product product = productRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_EXISTED));
        return toProductResponse(pageable, product);
    }

    public ReviewProductResponse getReviewByProduct(Pageable pageable, String productId) {
        return reviewService.getReviewProductResponse(pageable, productId);
    }

    public Page<ProductResponse> getProductsByCategory(Pageable pageable, String codeNameCategory) {
        if (!categoryRepository.existsByCodeName(codeNameCategory)) {
            throw new AppException(ErrorCode.CATEGORY_NOT_EXISTED);
        }
        Category category = categoryRepository.findByCodeName(codeNameCategory);
        log.info(category.getName());
        Page<Product> products = productRepository.findByCategory(pageable, category);
        log.info("{} products", products.getTotalElements());
        return products.map(productMapper::toProductResponse);
    }

    public Page<ProductResponse> getProductsBySearch(Pageable pageable, Map<String, String> params) {
        BigDecimal min = (params.get("min") != null && !params.get("min").isEmpty()) ? new BigDecimal(params.get("min")) : null;
        BigDecimal max = (params.get("max") != null && !params.get("max").isEmpty() && !params.get("max").equalsIgnoreCase("infinity")) ? new BigDecimal(params.get("max")) : null;

        Pageable sortedPageable;
        String sortBy = params.get("sortBy");
        String sortDirection = params.get("sortDirection");
        if (sortBy != null && !sortBy.isEmpty() && sortDirection != null && !sortDirection.isEmpty()) {
            Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortBy);
            sortedPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort);
        } else {
            sortedPageable = pageable;
        }
        String search = (params.get("search") != null && !params.get("search").isEmpty()) ? params.get("search") : null;

        Page<Product> products = productRepository.findBySearchWithFilters(sortedPageable, search, min, max);
        return products.map(product -> toProductResponse(pageable, product));
    }

    public Page<ProductResponse> getProductsByCategory(Pageable pageable,
                                                       String codeNameCategory, List<String> brands,
                                                       String minStr, String maxStr,
                                                       String sortBy, String sortDirection
    ) {
        if (!categoryRepository.existsByCodeName(codeNameCategory)) {
            throw new AppException(ErrorCode.CATEGORY_NOT_EXISTED);
        }
        Category category = categoryRepository.findByCodeName(codeNameCategory);

        if (brands == null || brands.isEmpty()) {
            brands = null;
        }
        BigDecimal min = (minStr != null && !minStr.isEmpty()) ? new BigDecimal(minStr) : null;
        BigDecimal max = (maxStr != null && !maxStr.isEmpty() && !maxStr.equalsIgnoreCase("infinity")) ? new BigDecimal(maxStr) : null;

        Pageable sortedPageable;
        if (sortBy != null && !sortBy.isEmpty() && sortDirection != null && !sortDirection.isEmpty()) {
            Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortBy);
            sortedPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort);
        } else {
            sortedPageable = pageable;
        }

        Page<Product> products = productRepository.findByCategoryWithFilters(sortedPageable, category, brands, min, max);
        return products.map(product -> toProductResponse(pageable, product));
    }

    public ProductResponse updateProduct(ProductUpdateRequest request, String id) throws AppException {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_EXISTED));

        // Cập nhật Category và Brand nếu cần
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_EXISTED));
            product.setCategory(category);
        }

        if (request.getBrandId() != null) {
            Brand brand = brandRepository.findById(request.getBrandId())
                    .orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_EXISTED));
            product.setBrand(brand);
        }



        // Ánh xạ các trường khác từ request
        productMapper.updateProduct(product, request);

        // Cập nhật promotions
//        var promotions = promotionRepository.findAllById(request.getPromotions());
//        product.setPromotions(new HashSet<>(promotions));
        if(!request.getPromotions().isEmpty()){
            Set<Promotion> promotion = new HashSet<>(promotionRepository.findAllById(request.getPromotions()));
            product.setPromotions(promotion);
        }
        return productMapper.toProductResponse(productRepository.save(product));
    }

    public void deleteProduct(String id) {
        if (!productRepository.existsById(id)) {
            throw new AppException(ErrorCode.PRODUCT_NOT_EXISTED);
        }
        productRepository.deleteById(id);
    }

    @Transactional
    public void saveProductsFromCsv(List<ProductCsvDTO> products, String categoryId) {
        // Kiểm tra danh mục tồn tại
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_EXISTED));
        Set<String> existingProductNames = new HashSet<>();

        for (ProductCsvDTO product : products) {

            if (!brandRepository.existsByName(product.getBrandName())) {
                brandRepository.save(Brand.builder().name(product.getBrandName()).build());
            }
        }
        for (ProductCsvDTO product : products) {
            if (existingProductNames.contains(product.getName()) || productRepository.existsByName(product.getName())) {
                continue; // Nếu sản phẩm đã tồn tại, bỏ qua
            }
            Brand brand = brandRepository.findByName(product.getBrandName())
                    .orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_EXISTED));
            Product pr = Product.builder()
                    .name(product.getName())
                    .description(product.getDescription())
                    .price(product.getPrice())
                    .stockQuantity(product.getStock_quantity())
                    .images(product.getImages())
                    .category(category)
                    .brand(brand) // Sử dụng thương hiệu đã kiểm tra
                    .build();
            productRepository.save(pr);
            existingProductNames.add(product.getName());
        }

    }

    public ProductResponse toProductResponse(Pageable pageable, Product product) {
        ProductResponse productResponse = productMapper.toProductResponse(product);
        ReviewProductResponse reviewProductResponse = reviewService.getReviewProductResponse(pageable, product.getId());
        productResponse.setReviewDetail(reviewProductResponse);
        return productResponse;
    }

    public Optional<Promotion> getHighestDiscountPromotion(Product product) {
        LocalDateTime today = LocalDateTime.now();

        return product.getPromotions().stream()
                .filter(promotion -> !today.isBefore(promotion.getStartDate()) && !today.isAfter(promotion.getEndDate()))
                .max(Comparator.comparing(Promotion::getDiscountPercentage));
    }

    public Long countAllProducts() {
        return productRepository.count();
    }

    public Long countProductInCurrentMonth() {
        return productRepository.countProductsCurrentMonth();
    }

    public Page<ProductResponse> searchProducts(String keyword, Pageable pageable) {
        Page<Product> products;
        if (keyword == null || keyword.isEmpty()) {
            products = productRepository.findAll(pageable);
        }else{
            products = productRepository.findByNameContainingIgnoreCase(keyword, pageable);
        }
        return products.map(productMapper::toProductResponse);
    }
}
