import "./Billing.css";

const Pagination = ({ currentPage, totalPages, onPrev, onNext }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination-arrows">
      <button
        className={`pagination-arrow-btn ${currentPage === 0 ? 'disabled' : ''}`}
        onClick={onPrev}
        disabled={currentPage === 0}
        aria-label="Previous page"
      >
        {'<'}
      </button>
      
      <span className="pagination-current">
        {currentPage + 1}
      </span>
      
      <button
        className={`pagination-arrow-btn ${currentPage >= totalPages - 1 ? 'disabled' : ''}`}
        onClick={onNext}
        disabled={currentPage >= totalPages - 1}
        aria-label="Next page"
      >
        {'>'}
      </button>
    </div>
  );
};

export default Pagination;
