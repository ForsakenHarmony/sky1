import auth from './auth';
import creation from './creation';


const Mutation = {
  ...auth,
  ...creation,
};

export default Mutation;
