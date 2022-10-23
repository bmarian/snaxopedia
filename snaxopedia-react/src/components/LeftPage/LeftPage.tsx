import type { Bug as BugType } from "../../types"
import "./LeftPage.css"

const locationURL = (locationName: string) => `http://localhost:8000/locations/${locationName}.webp`
const bugImageURL = (bugName: string) => `http://localhost:8000/bugs/${bugName}.png`

function Bug(props: any) {
  const { bug, modifyBug, setSelectedBug }: { bug: BugType, modifyBug: Function, setSelectedBug: Function } = props
  const { hasBeenPhotographed, hasBeenSeen, isSelected } = bug

  const bugClasses = `bug${hasBeenPhotographed ? ' has-photo' : ''}${isSelected ? ' is-selected' : ''}`;

  const changeBugStateEvent = (data: { hasBeenSeen?: boolean, hasBeenPhotographed?: boolean, isSelected?: boolean, }) => (evt: any) => {
    evt.stopPropagation()
    modifyBug(bug, data)
  }

  return (<li className={bugClasses} onClick={() => setSelectedBug(bug)}>
    <img className="bug-image" src={bugImageURL(bug.name)} alt={bug.name} title={bug.name} />
    {hasBeenSeen ?
      (<span className="has-been-seen on material-symbols-outlined" onClick={changeBugStateEvent({ hasBeenSeen: false, hasBeenPhotographed: false })}>visibility</span>) :
      (<span className="has-been-seen off material-symbols-outlined" onClick={changeBugStateEvent({ hasBeenSeen: true })}>visibility_off</span>)
    }
    {hasBeenPhotographed ?
      (<span className="has-been-photographed on material-symbols-outlined" onClick={changeBugStateEvent({ hasBeenPhotographed: false })}>check_circle</span>) :
      (<span className="has-been-photographed off material-symbols-outlined" onClick={changeBugStateEvent({ hasBeenSeen: true, hasBeenPhotographed: true })}>circle</span>)
    }
  </li>)
}

function Location(props: any) {
  const { group, modifyBug, setSelectedBug }: { group: { location: string, bugs: BugType[] }, modifyBug: Function, setSelectedBug: Function } = props

  return (<div className="group">
    <h2 className="group-title">
      <img className="location-image" src={locationURL(group.location)} alt={group.location} title={group.location} />
      <span>{group.location}</span>
    </h2>
    <ul className="group-bugs">
      {group.bugs.map((bug: BugType) => <Bug key={bug.name} bug={bug} modifyBug={modifyBug} setSelectedBug={setSelectedBug} />)}
    </ul>
  </div>)
}

export default function LeftPage(props: any) {
  const { snaxopedia, modifyBug, setSelectedBug }: { snaxopedia: BugType[], modifyBug: Function, setSelectedBug: Function } = props

  return (<div className="left-page">
    <header className="left-header"><span className="title">Snaxopedia</span></header>
    <div className="locations-list">
      {snaxopedia.map((group: any) => <Location key={group.location} group={group} modifyBug={modifyBug} setSelectedBug={setSelectedBug} />)}
    </div>
  </div>)
}