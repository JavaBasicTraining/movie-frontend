export default function Group({title, content}) {
  return (
    <div className="content_group">
      <label className="content-group__title">{title}</label>
      {content}
    </div>
  );
}
