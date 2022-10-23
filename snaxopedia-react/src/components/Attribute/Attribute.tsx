import "./Attribute.css"

export default function Attribute(props: any) {
  const { attributes = [] } = props

  return (<div className="attributes">
    {attributes.map((attr: string) => <span key={attr} className={`attribute-label ${attr.toLowerCase()}`}>{attr.toUpperCase()}</span>)}
  </div>)
}