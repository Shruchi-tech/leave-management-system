import { useEffect } from "react";

import useHolidayStore from "../../store/holidayStore";
import "../../styles/Holidays.css";

const Holidays = () => {

    const {
        holidays,
        loading,
        fetchHolidays
    } = useHolidayStore();


    useEffect(() => {

        fetchHolidays()
            .catch(() => {});

    }, [fetchHolidays]);


    if (loading && holidays.length === 0) {
        return (
            <div className="holidays-page">
                <div className="holiday-loading">
                    Loading holidays...
                </div>
            </div>
        );
    }


    return (

        <div className="holidays-page">

            <div className="holidays-header">

                <div>
                    <h1>Holidays</h1>

                    <p>
                        View all upcoming holidays and important dates.
                    </p>
                </div>

                <div className="holiday-count">
                    {holidays.length} Holidays
                </div>

            </div>


            {holidays.length === 0 ? (

                <div className="empty-holidays">

                    <div className="empty-icon">
                        📅
                    </div>

                    <h3>No holidays found</h3>

                    <p>
                        There are currently no holidays available.
                    </p>

                </div>

            ) : (

                <div className="holidays-grid">

                    {holidays.map((holiday) => (

                        <div
                            className="holiday-card"
                            key={holiday.id}
                        >

                            <div className="holiday-icon">
                                📅
                            </div>

                            <div className="holiday-info">

                                <h3>
                                    {holiday.title}
                                </h3>

                                <p className="holiday-date">
                                    {new Date(
                                        holiday.holiday_date
                                    ).toLocaleDateString(
                                        "en-IN",
                                        {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric"
                                        }
                                    )}
                                </p>

                                {holiday.description && (

                                    <p className="holiday-description">
                                        {holiday.description}
                                    </p>

                                )}

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );
};

export default Holidays;