package com.nienluan.webshop.controller;

import com.nienluan.webshop.dto.request.ReviewRequest;
import com.nienluan.webshop.dto.response.ApiResponse;
import com.nienluan.webshop.dto.response.ReviewResponse;
import com.nienluan.webshop.service.ReviewService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/reviews")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ReviewController {
    ReviewService reviewService;

    @PostMapping
    public ApiResponse<ReviewResponse> createReview(@RequestBody ReviewRequest request) {
        return ApiResponse.<ReviewResponse>builder()
                .result(reviewService.createReview(request))
                .build();
    }

    @GetMapping
    public ApiResponse<Page<ReviewResponse>> getReviews(Pageable pageable) {
        return ApiResponse.<Page<ReviewResponse>>builder()
                .result(reviewService.getAllReviews(pageable))
                .build();
    }

    @GetMapping("/filter")
    public ApiResponse<Page<ReviewResponse>> getFilterReviews(
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) String productId,
            @RequestParam(required = false) Integer rating,
            Pageable pageable) {

        Page<ReviewResponse> reviews = reviewService.getFilteredReviews(userId, productId, rating, pageable);
        return ApiResponse.<Page<ReviewResponse>>builder()
                .result(reviews)
                .build();
    }

}
