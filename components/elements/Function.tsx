/* eslint-disable prettier/prettier */
import dayjs from 'dayjs';
import moment from 'moment';

export const formatDate = (date: any) => {
  return dayjs(date).format('MMMM D, YYYY h:mm A');
};
export const formatDateTime = (date: any) => {
  return dayjs(date).format('MMM D,h:mm A');
};
export const formatCurrency = (amount: any) => {
  return `₹ ${amount}`;
};


export const format24ToTime = (time: string) => {
  return moment(time, 'HH:mm').format('h:mm A');
};
