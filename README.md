# Introduction

This is a Gatsby source plugin for building websites using the [Storyblok](https://www.storyblok.com) headless CMS with true visual preview as a data source.

## Install

```sh
$ npm install --save gatsby-source-storyblok # or yarn add gatsby-source-storyblok
```

## Usage

1. You need to declare the plugin use and its options in `gatsby-config.js`

```JavaScript
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-source-storyblok',
      options: {
        accessToken: 'YOUR_TOKEN',
        version: 'draft',
        localAssets: true, // Optional parameter to download the images to use with Gatsby Image Plugin
        languages: ['de', 'at'] // Optional parameter. Omission will retrieve all languages by default.
      }
    }
  ]
}
```

`src/components/layout.js`

```JavaScript
import * as React from "react"
import PropTypes from "prop-types"
import { storyblokInit, apiPlugin } from "gatsby-source-storyblok"
import Teaser from './Teaser'
import Grid from './Grid'
import Feature from './Feature'
import configuration from '../../gatsby-config'

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

const Layout = ({ children }) => {
  return (
    <div>
      <main>{children}</main>
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
```

### With Gatsby's image

You need to set the `localAssets` option to `true`. Here is an example of the usage:

```
import { graphql } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"

function BlogPost({ data }) {
  const image = getImage(data.file)
  return (
    <section>
      <h2>{data.blogPost.title}</h2>
      <GatsbyImage image={image} />
    </section>
  )
}

export const pageQuery = graphql`
  query {
    file(name: {eq: "demo"}) {
      absolutePath
      url
      childImageSharp {
         gatsbyImageData(
          width: 200
          placeholder: BLURRED
          formats: [AUTO, WEBP, AVIF]
        )
      }
    }
  }
`
```

### With Gatsby's createPages

For more info regarding `createPages` see the Gatsby docs: [docs/reference/config-files/gatsby-node/#createPages](https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/#createPages)

2a. You need to create a [template](https://www.gatsbyjs.org/docs/programmatically-create-pages-from-data/#specifying-a-template) file to get the data from GraphQL

```js
import React from 'react'
import { graphql } from 'gatsby'

export default function StoryblokEntry ({ data }) {
  const story = data.storyblokEntry

  return (
    <div>{story.name}</div>
  )
}

export const query = graphql`
  query($slug: String!) {
    storyblokEntry(slug: { eq: $slug }) {
      id
      name
      full_slug
    }
  }
`
```

3a. After this, you need to create the pages for your application. For this, edit your `gatsby-node.js`.

```js
const path = require('path')

exports.createPages = async ({ graphql, actions }) => {
  const storyblokEntry = path.resolve('src/templates/storyblok-entry.js')

  // querying the storyblok data from GraphQL data layer
  const { data } = await graphql(
    `query {
      allStoryblokEntry {
        edges {
          node {
            id
            full_slug
          }
        }
      }
    }`
  )

  // creating pages using createPage function like described in the documentation
  // https://www.gatsbyjs.org/docs/programmatically-create-pages-from-data/#creating-pages
  data.allStoryblokEntry.edges.forEach(edge => {
    const full_slug = edge.node.full_slug

    actions.createPage({
      path: full_slug,
      component: storyblokEntry,
      context: {
        slug: full_slug
      },
    })
  })
}
```


### With Gatsby's File System Routes API

For more info regarding The File System Routes API see the Gatsby docs: [docs/reference/routing/file-system-route-api/](https://www.gatsbyjs.com/docs/reference/routing/file-system-route-api/)

2b. Create a collection route inside `src/pages`


```
|-- src
   |-- pages
      |-- {storyblokEntry.full_slug}.js
```


3b. Gatsby will use ths page template for each `storyblokEntry`

```js
import React from 'react'
import { graphql } from 'gatsby'

export default function StoryblokEntry({ data }) {
  const story = data.storyblokEntry

  return <div>{story.name}</div>
}

export const query = graphql`
  query ($full_slug: String!) {
    storyblokEntry(full_slug: { eq: $full_slug }) {
      id
      name
      full_slug
    }
  }
`
```

## Rendering Storyblok content

To source Storyblok's content add content to your GraphQL query. By importing `StoryblokComponent`, you can render components dynamically. `storyblokEditable` function lets you to make your components editable in [storyblok.com](https://www.storyblok.com/)

```js
import React from 'react'
import { graphql } from 'gatsby'
import { StoryblokComponent, storyblokEditable, useStoryblokState } from "gatsby-source-storyblok"

const IndexPage = ({ data }) => {
  let story = data.storyblokEntry
  story = useStoryblokState(story)

  const components = story.content.body.map(blok => (<StoryblokComponent blok={blok} key={blok._uid} />))

  return (
    <Layout>
      <div {...storyblokEditable(story.content)}>
        <h1>{story.name}</h1>
        {components}
      </div>
    </Layout>
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
```


## The options object in details

```js
{
  resolve: 'gatsby-source-storyblok',
  options: {
    accessToken: 'YOUR_TOKEN',
    version: 'draft',
    resolveRelations: [''],
    includeLinks: false
  }
}
```

* `accessToken`: Your Storyblok draft token
* `version`: 'draft' or 'published'
* `timeout`: Optionally provide a timeout for the api request
* `resolveLinks`: This will automatically resolve internal links of the multilink field type. If the value is `story` the whole story object will be included.  If the value is `url` only uuid, id, name, path, slug and url (url is a computed property which returns the "Real path" if defined to use it for navigation links) will be included. 
* `resolveRelations`: Resolve relationships to other Stories (in the first level of nesting) of a multi-option or single-option field-type. Provide the field key(s) as array to resolve specific fields. Example: ['article.related_articles', 'article.author'].
* `includeLinks`: If 'true' you can query links by allStoryblokLinkEntry. The links query lets you create a dynamic navigation tree as it includes also content folders.
* `languages`: An array of strings that will be used in languages request instead of languages in space settings. Use it to only load the languages that you want to.

## How to query?

### All Content Entries

To get all entries unfiltered you can do the following query:

```GraphQL
{
  allStoryblokEntry {
    edges {
      node {
        id
        name
        created_at
        published_at
        uuid
        slug
        full_slug
        content
        is_startpage
        parent_id
        group_id
      }
    }
  }
}
```

#### Filtering of content inside a folder

The following example shows a filter to get all items from a news folder:

```GraphQL
{
  allStoryblokEntry(filter: {full_slug: {regex: "/^news\//"}}) {
    edges {
      node {
        name
        full_slug
      }
    }
  }
}
```

#### Filtering of languages

If you use field level translations you can filter for a specific language using following query:

```GraphQL
{
  allStoryblokEntry(filter: {lang: {eq: "de"}}) {
    edges {
      node {
        name
        full_slug
      }
    }
  }
}
```


#### Filtering on content type fields

Every field of your content types is available via the prefix ```field_```.

This lets you for example to query for a specific component:

```GraphQL
{
  allStoryblokEntry(filter: {field_component: {eq: "page"}}) {
    edges {
      node {
        name
        full_slug
      }
    }
  }
}
```


### A Single Content Entry
```GraphQL
{
  storyblokEntry(slug: { eq: "global-navi" }) {
    content
  }
}
```

### Datasources

```GraphQL
allStoryblokDatasource {
  edges {
    node {
      id
      value
      name
      data_source
    }
  }
}
```

### Datasource Entries

This will return all datasources, with or not dimensions values:

```GraphQL
allStoryblokDatasourceEntry(filter: { data_source: { eq: "DATASOURCE_SLUG" } }) {
  edges {
    node {
      id
      name
      value
      data_source
      data_source_dimension
    }
  }
}
```

If you want to **filter by a specific dimension**, you should use:

```GraphQL
allStoryblokDatasourceEntry(filter: { data_source: { eq: "DATASOURCE_SLUG" }, data_source_dimension: { eq: "DATASOURCE_DIMENSION_VALUE" } }) {
  edges {
    node {
      id
      name
      value
      data_source
      data_source_dimension
    }
  }
}
```

### Links
Use the links api to create a dynamic navigation tree. To use this query you need to add `includeLinks: true` in the plugin options.

```GraphQL
allStoryblokLinkEntry {
  edges {
    node {
      id
      uuid
      slug
      parent_id
      name
      is_folder
      published
      is_startpage
      position
    }
  }
}
```

## Contribution

Fork me on [Github](https://github.com/storyblok/gatsby-source-storyblok).

This project use [semantic-release](https://semantic-release.gitbook.io/semantic-release/) for generate new versions by using commit messages and we use the Angular Convention to naming the commits. Check [this question](https://semantic-release.gitbook.io/semantic-release/support/faq#how-can-i-change-the-type-of-commits-that-trigger-a-release) about it in semantic-release FAQ
