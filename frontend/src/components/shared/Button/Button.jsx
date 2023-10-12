const Button = ({ children, onClick, style }) => {
  return (
    <button onClick={onClick} className={`btn ${style}`}>
      {children}
    </button>
  );
};
export default Button;
