
package com.intech.dukaantech.common.dto;

import lombok.*;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PageResponse<T> {

    private int page;
    private int size;
    private int totalPages;
    private long totalElements;
    private List<T> data;

}
