import { useEffect } from "react";

import useHolidayStore from "../../store/holidayStore";


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

        return <h2>Loading holidays...</h2>;

    }


    return (

        <div>

            <h1>Holidays</h1>

            {holidays.length === 0 ? (

                <p>
                    No holidays found.
                </p>

            ) : (

                <div>

                    {holidays.map((holiday) => (

                        <div key={holiday.id}>

                            <h3>
                                {holiday.title}
                            </h3>

                            <p>
                                Date: {holiday.holiday_date}
                            </p>

                            {holiday.description && (

                                <p>
                                    {holiday.description}
                                </p>

                            )}

                        </div>

                    ))}

                </div>

            )}

        </div>

    );
};


export default Holidays;