import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

export const usePagination = (limit = 4) => {
    const navigate = useNavigate();
    const location = useLocation();
    const pageParam = new URLSearchParams(location.search).get("page");

    const [currentPage, setCurrentPage] = useState(1);
    const [numberOfData, setNumberOfData] = useState(0);
    const [numberOfPages, setNumberOfPages] = useState(0);

    useEffect(() => {
        setCurrentPage(+pageParam || 1);
    }, [pageParam]);

    useEffect(() => {
        setNumberOfPages(Math.ceil(numberOfData / limit));
    }, [numberOfData, limit]);

    const handleClickPageButton = useCallback(
        (page) => {
            navigate(`${location.pathname}?page=${page}`);
            setCurrentPage(page);
            //console.log(page);
        },
        [navigate, location.pathname]
    );

    return {
        currentPage,
        numberOfPages,
        setCurrentPage,
        handleClickPageButton,
        setNumberOfData,
    };
};