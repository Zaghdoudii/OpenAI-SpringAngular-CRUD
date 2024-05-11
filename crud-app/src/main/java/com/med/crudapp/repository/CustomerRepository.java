package com.med.crudapp.repository;

import com.med.crudapp.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface  CustomerRepository extends JpaRepository<Customer, Long> {

}
