package com.intech.dukaantech.common.exception;

import lombok.*;

import java.time.LocalDateTime;
import java.util.Map;

// we use this class to response errors in the formate like...
/*{
 *   timestamp: current time,
 *   status: status code
 *   errors: {
 *              message: ""
 *           }
 * }*/

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ApiErrorResponse {

    private LocalDateTime timestamp;
    private int status;
    private Map<String, String> errors;

}