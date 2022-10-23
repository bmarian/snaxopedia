import { Bug as BugType } from "../../types"
import "./RightPage.css"

const locationURL = (locationName: string) => `http://localhost:8000/locations/${locationName}.webp`
const bugImageURL = (bugName: string) => `http://localhost:8000/bugs/${bugName}.png`

export default function RightPage(props: any) {
  const { selectedBug, modifyBug, setLoading }: { selectedBug: BugType, modifyBug: Function, setLoading: Function } = props
  return (<div className="right-page"></div>)
}