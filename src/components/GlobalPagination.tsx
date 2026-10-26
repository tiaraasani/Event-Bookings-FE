import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface GlobalPaginationProps {
  currentPage: number;
  totalPage: number;
  onChangePage: (page: number) => void;
}

function GlobalPagination({
  currentPage,
  totalPage,
  onChangePage,
}: GlobalPaginationProps) {
  const handlePrev = () => {
    if (currentPage > 1) {
      onChangePage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPage) {
      onChangePage(currentPage + 1);
    }
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem onClick={handlePrev}>
          <PaginationPrevious aria-disabled={currentPage <= 1} />
        </PaginationItem>

        <PaginationItem>
          <PaginationLink>
            {currentPage} / {totalPage}
          </PaginationLink>
        </PaginationItem>

        <PaginationItem onClick={handleNext}>
          <PaginationNext aria-disabled={currentPage >= totalPage} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export default GlobalPagination;
