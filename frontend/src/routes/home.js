import { h, Component } from 'preact';
import { Query } from 'react-apollo';
import { Link } from 'preact-router/match';

import creations from '../gql/creations.graphql';

const CreationCard = ({
  post: { id, name, description, pictures, creator },
}) => (
  <Link className="card no-deco creation" key={id} href={`/creation/${id}`}>
    <div className="card-header">
      <div className="card-title h5">{name}</div>
    </div>
    <div className="card-image">
      <img src={pictures[0].url} alt=":(" className="img-responsive" />
    </div>
    <div className="card-body">{description}</div>
    <div className="card-footer">
      <div className="chip">
        <img src={creator.avatar} className="avatar avatar-sm" />
        {creator.username}
      </div>
      <button className="btn btn-primary float-right">
        <i className="icon icon-emoji" />
      </button>
    </div>
  </Link>
);

export default class Home extends Component {
  render() {
    return (
      <div className="container">
        <Query query={creations}>
          {({ loading, error, data }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error :(</p>;

            const { creations } = data;

            return (
              <div className="columns">
                {creations.map(post => (
                  <div className="column col-4 col-md-6 col-xs-12">
                    <CreationCard post={post} />
                  </div>
                ))}
              </div>
            );
          }}
        </Query>
      </div>
    );
  }
}
