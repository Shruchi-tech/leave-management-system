import api from "../api/axios";

export const getDateSuggestions = async (days) => {
    const response = await api.get(
        `/ml/date-suggestions?days=${days}`
    );

    return response.data;
};

export const getCoverageWarning = async (
    startDate,
    endDate
) => {
    const response = await api.get(
        `/ml/coverage?start_date=${startDate}&end_date=${endDate}`
    );

    return response.data;
};