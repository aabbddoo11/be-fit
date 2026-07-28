import { Link } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";
import "./Breadcrumb.css";

function Breadcrumb({ items }) {
  return (
    <nav className="breadcrumb">

      {items.map((item, index) => (

        <div
          key={index}
          className="breadcrumb-item"
        >

          {item.link ? (

            <Link to={item.link}>
              {item.label}
            </Link>

          ) : (

            <span className="active">
              {item.label}
            </span>

          )}

          {index < items.length - 1 && (
            <FiChevronRight className="separator" />
          )}

        </div>

      ))}

    </nav>
  );
}

export default Breadcrumb;