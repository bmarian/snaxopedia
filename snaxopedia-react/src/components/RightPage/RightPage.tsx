import { useCallback, useEffect } from "react"
import { Bug as BugType } from "../../types"
import Attribute from "../Attribute/Attribute"
import "./RightPage.css"

const bugImageURL = (bugName: string) => `http://localhost:8000/bugs/${bugName}.png`
const cleanupFormatting = (formattedString: string): string => {
  return formattedString
    .replaceAll(/\[\[(.*?)\|.*?\]\]/g, (_match, $1) => $1)
    .replaceAll(/\[\[(.*?)\]\]/g, (_match, $1) => $1)
}

export default function RightPage(props: any) {
  const { selectedBug, modifyBug, setLoading }: { selectedBug: BugType, modifyBug: Function, setLoading: Function } = props

  const parsePageContent = useCallback((page: string) => {
    const sections: string[] = page.split(/^==(.*)==$/m)
    let data = null

    if (!selectedBug?.strategy) {
      const strategySectionIndex = sections.findIndex((section) =>
        section.toLowerCase().includes("strategy")
      )
      const strategySection = cleanupFormatting(
        sections[strategySectionIndex + 1]
      )
      data = { strategy: strategySection }
    }

    if (typeof selectedBug?.calories === "undefined") {
      const caloriesSection = sections
        .find((section: string) => section.includes("calories"))
        ?.split?.("\n")
        ?.find?.((row: string) => row.includes("calories"))
      const calories = caloriesSection?.match(/[\d,]+/g)?.[0]

      if (calories) data = { ...data, calories }
    }

    if (!selectedBug?.attributes) {
      const attributesSection = sections
        .find((section: string) => section.includes("attributes"))
        ?.split?.("\n")
        ?.find?.((row: string) => row.includes("attributes"))
      const attributes = [
        ...(attributesSection?.matchAll(/\[\[.*?Attribute (.*?)\..*?\]\]/g) ||
          []),
      ].map(([_, attribute]) => attribute)

      if (attributes) data = { ...data, attributes }
    }

    if (data) modifyBug(selectedBug as BugType, data)
    setLoading(false)
  }, [selectedBug])

  const updateSelected = useCallback(async () => {
    if (!selectedBug?.name) return
    const hasAllAttributes = [
      selectedBug.strategy,
      selectedBug.attributes,
      selectedBug.calories,
    ].reduce((acc, attribute) => acc && typeof attribute !== "undefined", true)
    if (hasAllAttributes) return
    setLoading(true)

    const bugsnaxWikiAuthPage = "https://bugsnax.fandom.com/api.php?action=centralauthtoken&origin=*"
    const bugsnaxWikiPage = `https://bugsnax.fandom.com/api.php?action=query&titles=${selectedBug.name}&gaplimit=5&prop=revisions&rvprop=content&format=json&origin=*`

    try {
      await fetch(bugsnaxWikiAuthPage, { mode: "cors" })
      const response = await fetch(bugsnaxWikiPage, { mode: "cors" })
      const responseJSON = await response.json()

      const revisions = Object.values(
        // @ts-ignore
        Object.values(responseJSON?.query?.pages)?.[0]?.revisions
      )
      if (!revisions) {
        setLoading(false)
        return
      }
      // @ts-ignore
      const pageContent = revisions[revisions.length - 1]?.["*"]
      if (!pageContent) {
        setLoading(false)
        return
      }

      parsePageContent(pageContent)
    } catch (err) {
      console.log(err)
      setLoading(false)
    }
  }, [selectedBug])

  useEffect(() => { updateSelected() }, [selectedBug])

  return (<div className="right-page">
    <header className="header"></header>
    {selectedBug?.name && <div className="bug-info">
      <p className="bug-name">{selectedBug.name}</p>
      <div className="bug-image-container">
        <span className="bug-image-top-left-triangle">◤</span>
        <span className="bug-image-top-right-triangle">◥</span>

        {selectedBug?.calories && <div className="calories-container">
          <span className="calories-title">CALORIES</span>
          <span className="calories-number">{selectedBug.calories}</span>
        </div>}

        <img className="right-bug-image" src={bugImageURL(selectedBug.name)} alt={selectedBug.name} title={selectedBug.name} />

        <span className="bug-image-bottom-left-triangle">◣</span>
        <span className="bug-image-bottom-right-triangle">◢</span>
      </div>
      {selectedBug?.attributes && <Attribute attributes={selectedBug.attributes} />}
      {selectedBug?.strategy && <div className="bug-strategy">
        <p className="title">STRATEGY</p>
        <p className="strategy">{selectedBug.strategy}</p>
      </div>}
    </div>}
  </div>)
}