import * as React from "react"
import { Link, graphql } from "gatsby"
import configuration from '../../gatsby-config'
import { storyblokInit, apiPlugin, StoryblokComponent, storyblokEditable, useStoryblokState } from "gatsby-source-storyblok"
import Teaser from '../components/Teaser'
import Grid from '../components/Grid'
import Feature from '../components/Feature'

const sbConfig = configuration.plugins.find((item) => item.resolve === 'gatsby-source-storyblok')

storyblokInit({
  accessToken: sbConfig.options.accessToken,
  use: [apiPlugin],
  components: {
    teaser: Teaser,
    grid: Grid,
    feature: Feature
  }
});

const IndexPage = ({ data }) => {
  console.log(data)
  let story = data.storyblokEntry
  story = useStoryblokState(story)

  const components = story.content.body.map(blok => (<StoryblokComponent blok={blok} key={blok._uid} />))

  return (
    <div {...storyblokEditable(story.content)}>
      <h1>{story.name}</h1>
      {components}
    </div>
  )
}

export default IndexPage

export const query = graphql`
  query HomeQuery {
    storyblokEntry(full_slug: { eq: "gatsby/test" }) {
      content
      name
      full_slug
      uuid
      id
      internalId
    }
  }
`