import Skeleton from "react-loading-skeleton";
import "./skeleton.css";

const SkeletonLoader = () => {
  return (
    <Skeleton className="skeleton-loader" width={290} height={400} count={12} />
  );
};

export default SkeletonLoader;
