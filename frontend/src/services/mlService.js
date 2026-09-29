import api from "../api/axios";

export const getDateSuggestions = async (days) => {
    const response = await api.get(
        `/ml/date-suggestions?days=${days}`
    );

    return response.data;
};