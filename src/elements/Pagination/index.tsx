import "./style.scss";

import React, { useMemo } from "react";
import ReactPaginate from "react-paginate";

interface PaginationProps {
  totalPage: number;
  currentPage: number;
  onPageChange: (selectedItem: { selected: number }) => void;
  marginPagesDisplayed?: number;
  pageRangeDisplayed?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  totalPage,
  currentPage,
  onPageChange,
  marginPagesDisplayed = 1,
}) => {
  const pageRangeDisplayed = useMemo(() => {
    if (totalPage >= 10) {
      return 10 - 2 * marginPagesDisplayed;
    }
    return totalPage;
  }, [totalPage, marginPagesDisplayed]);

  return (
    <div className="flex items-center justify-center">
      <ReactPaginate
        previousLabel={<ChevronLeft />}
        nextLabel={<ChevronRight />}
        breakLabel="..."
        pageCount={totalPage}
        marginPagesDisplayed={marginPagesDisplayed}
        pageRangeDisplayed={pageRangeDisplayed}
        onPageChange={onPageChange}
        forcePage={currentPage}
        containerClassName="pagination"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="previous"
        previousLinkClassName="previous-link"
        nextClassName="next"
        nextLinkClassName="next-link"
        breakClassName="break"
        breakLinkClassName="break-link"
        activeClassName="active"
      />
    </div>
  );
};

function ChevronLeft() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M15 18L9 12L15 6"
        stroke="var(--text-6)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9 18L15 12L9 6"
        stroke="var(--text-6)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default Pagination;
