import { NodeHandler, NodeHandlers, TipTapRender } from "@troop.com/tiptap-react-render"

const doc: NodeHandler = (props) => {
    return <>{props.children}</>;
}

const paragraph: NodeHandler = (props) => {
    return <p>{props.children}</p>;
}

const text: NodeHandler = (props) => {
    return <span>{props.node.text}</span>;
}

const heading: NodeHandler = (props) => {
    const Tag = `h${props.node.attrs?.level}` as keyof JSX.IntrinsicElements;
    return <Tag>{props.children}</Tag>;
}

const bulletList: NodeHandler = (props) => {
    return <ul>{props.children}</ul>;
}

const listItem: NodeHandler = (props) => {
    return <li>{props.children}</li>;
}

const link: NodeHandler = (props) => {
    return <a href={props.node.attrs?.href}>{props.children}</a>;
}

const handlers: NodeHandlers = {
    doc: doc,
    text: text,
    paragraph: paragraph,
    heading: heading,
    bulletList: bulletList,
    listItem: listItem,
    link: link,
}

const RenderJson = ({data}: {data: any}) => {
    const jsonData = typeof data === 'string' ? JSON.parse(data) : data;
    return (
    <div className="px-2 pt-2 prose dark:prose-invert">
        <TipTapRender handlers={handlers} node={jsonData}/>
    </div>
    );
}

export default RenderJson
