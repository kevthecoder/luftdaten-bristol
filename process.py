"""Processing Luftdaten data."""
import calendar

def create_24_hour_means(raw_data, value_column, date_column):
    """Takes raw sensor data and produces 24 hour mean for each data point.

    :param raw_data: The raw sensor data to aggregate
    :type raw_data: DataFrame
    :param value_column: Name of the column with values to aggregate
    :type value_column: str
    :param date_column: Name of the datetime column
    :type date_column: str
    :returns: DataFrame containing rolling 24 hour means
    :rtype: DataFrame"""
    df1 = raw_data.set_index(date_column).sort_index()
    df_24_hour_means = df1[value_column].rolling('24H').mean()
    return df_24_hour_means

def create_hourly_means_by_weekday_and_hour(raw_data, value_column, date_column):
    """Takes raw sensor data and produces 24 hour mean for each data point.

    :param raw_data: The raw sensor data to aggregate
    :type raw_data: DataFrame
    :param value_column: Name of the column with values to aggregate
    :type value_column: str
    :param date_column: Name of the datetime column
    :type date_column: str
    :returns: DataFrame containing data grouped by day of week and hour of day
    :rtype: DataFrame"""
    data = raw_data.copy()

    # Add extra of columns for day of week and hour of day
    data['dayOfWeek'] = data[date_column].map(lambda x: calendar.day_name[x.weekday()])
    data['hourOfDay'] = data[date_column].map(lambda x: x.hour)

    # Group the data by day of week and hour of day
    grouped = data[value_column].groupby([data['dayOfWeek'], data['hourOfDay']])
    # print(grouped.head())
    # print(grouped.mean())
    mean_by_weekday_and_hour = grouped.mean()
    # print(mean_by_weekday_and_hour)

    return mean_by_weekday_and_hour
