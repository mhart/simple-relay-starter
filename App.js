/* eslint-env es6 */
var React = require('react')
var Relay = require('react-relay')

// A simple top-level component that illustrates how to render Relay-fetched
// data using props. In this case Relay will populate a `user` property that
// has a collection of `widgets` based on the queries and fragments we give it
// further below.
class App extends React.Component {
  render() {
    return (
      <div>
        <h2>User: {this.props.user.name}</h2>
        <h2>Widgets:</h2>
        <ul>
          {/* In schema/schema.js we define a Connection between users and widgets */}
          {/* Connections use `edges` and `node` to hold paging info and child items */}
          {this.props.user.widgets.edges.map(edge =>
            <li key={edge.node.id}>{edge.node.name} (Global ID: {edge.node.id})</li>
          )}
        </ul>
      </div>
    )
  }
}

// The component we need to export is a Relay wrapper around our App component
// from above. It declares the GraphQL fragments where we list the properties
// we want to be fetched – eg, user.name, user.widgets.edges, etc
exports.Container = Relay.createContainer(App, {
  fragments: {
    // The property name here reflects what is added to `this.props` above.
    // This template string will be parsed by babel-relay-plugin when we browserify.
    user: () => Relay.QL`
      fragment on User {
        name,
        widgets(first: 10) {
          edges {
            node {
              id,
              name,
            },
          },
        },
      }
    `,
  },
})

// The Relay root container needs to know what queries will occur at the top
// level – these configurations are currently called Routes in Relay, but this
// name is misleading and under review so we don't use it here.
exports.queries = {
  name: 'AppQueries', // can be anything, just used as an identifier
  params: {},
  queries: {
    // We can use this shorthand so long as the component we pair this with has
    // a fragment named "user", as we do above.
    user: () => Relay.QL`query { user }`,
  },
}

