import useSWR from 'swr';
import { axiosInstance } from '../configs/axiosConfig';

const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

const useSWRFetch = ({url, options= {}, params = {}}) => {
  const queryString = new URLSearchParams(params).toString();
  const fullUrl = queryString ? `${url}?${queryString}` : url;

  const { data, error, isValidating } = useSWR(fullUrl, fetcher, options);

  return {
    data,
    error,
    isLoading: !error && !data,
    isValidating,
  };
};

export default useSWRFetch;
