

export default function Group({ title, content }) {
    return (
        <div className="content_group">
            <label>{title}</label>
            {content}
        </div>
    )
}