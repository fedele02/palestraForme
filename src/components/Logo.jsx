export const Logo = ({ className = "" }) => (
  <img
    src={`${import.meta.env.BASE_URL}icona2.png?v=2`}
    alt="Logo ME Power Fitness Experience"
    className={`${className} object-contain`}
  />
);
