import { KanbanData } from "./Grid";

type Props = {
  draggable?: boolean;
  data: KanbanData;
};

const getTagClass = (tag: string) => {
  switch (tag.toLowerCase()) {
    case "engineering":
      return "bg-yellow";
    case "feature":
      return "bg-orange";
    case "product":
      return "bg-purple";
    case "bug":
      return "bg-red";
    default:
      return "";
  }
};

const Card = ({ draggable, data }: Props) => {
  return (
    <div draggable={draggable} className="card">
      <div className="card-content">
        <span>{data.task}</span>
        <span>{data.user}</span>
        <div className="tags">
          {data.tags &&
            data.tags.map((tag, idx) => {
              const classes = getTagClass(tag);
              return (
                <span key={idx} className={`tag ${classes}`}>
                  {tag}
                </span>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Card;
