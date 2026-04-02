package com.intech.dukaantech.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardFilter {

    private String fromDate;
    private String toDate;
    private String search;
    private String sortBy;
    private String sortDir;
    private int page;
    private int size;
}
