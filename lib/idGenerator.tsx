type IdGeneratorFunc = () => string;

const idGenerator: IdGeneratorFunc = () => {
  return Math.floor(Math.random() * 10001).toString();
};

export default idGenerator;
