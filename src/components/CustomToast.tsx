interface Props {
  iconClassName: string;
  title: string;
  message: string;
}

const CustomToast = ({ iconClassName, title, message }: Props) => {
  return (
    <div className="d-flex align-items-center">
      <div className="toast-icon-container me-3">
        <i className={iconClassName}></i>
      </div>
      <div>
        <p className="fw-bold mb-0">{title}</p>
        <p className="mb-0">{message}</p>
      </div>
    </div>
  );
};

export default CustomToast;