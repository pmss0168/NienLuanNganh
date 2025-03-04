package com.nienluan.webshop.repository;

import com.nienluan.webshop.entity.Province;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProvinceRepository extends JpaRepository<Province, Integer> {
    boolean existsByCodeName(String codeName);
}
