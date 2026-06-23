"use client";
import React, { useState } from "react";
import ReactPaginate from "react-paginate";
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from "lucide-react";

import "./style.scss";

type Props = {
  pagination?: {
    totalCount: number;
    totalPage: number;
    pageNum: number;
    onChange: (page: number) => void;
  };
};

const Pagination = (props: Props) => {
  const totalPages = props.pagination?.totalPage ?? 1;
  const [currentPage, setCurrentPage] = useState(
    props.pagination?.pageNum ? props.pagination?.pageNum - 1 : 0
  );

  const handlePageClick = (data: { selected: number }) => {
    setCurrentPage(data.selected);
    props.pagination?.onChange(data.selected + 1);
  };

  return (
    <div className="self-end flex flex-row items-center justify-between w-full text-[#898BAB] text-[1.6rem] font-[400] font-inter pagination-container">
      <div>Showing 1 to 10 of {props.pagination?.totalCount} entries</div>
      <div className="flex flex-row">
        <div className="w-full">
          <ReactPaginate
            breakLabel={"..."}
            breakClassName={"break-me"}
            pageCount={totalPages}
            marginPagesDisplayed={1}
            pageRangeDisplayed={2}
            onPageChange={handlePageClick}
            forcePage={currentPage}
            containerClassName={"pagination"}
            activeClassName={"active"}
            previousLabel={<ChevronLeftIcon />}
            nextLabel={<ChevronRightIcon />}
            previousClassName={"btn-back"}
            nextClassName={"btn-next"}
            pageClassName={"btn-page"}
            activeLinkClassName={"bg-[#E60028] text-[#FDFEFF]"}
          />
        </div>
      </div>
      <div className="flex flex-row items-center gap-[1.4rem]">
        <div className="text-[#3A3B4F] text-[1.6] font-[400] text-inter">Quick filter</div>
        <input
          onChange={(e) => {
            props.pagination?.onChange(Number(e.target.value));
            setCurrentPage(Number(e.target.value) - 1);
          }}
          type="number"
          className="w-[5.5rem] h-[3.2rem] px-[0.8rem] outline-none rounded-[8px] border-[1px] border-solid border-[#E6E7F5]"
        />
      </div>
    </div>
  );
};

export default Pagination;
