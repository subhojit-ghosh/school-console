import { Button, Container, Group, Text, Title } from '@mantine/core';
import { Link } from 'react-router-dom';
import { Illustration } from './Illustration';
import classes from './PageNotFound.module.css';

export function PageNotFound() {
  return (
    <Container className={classes.root}>
      <div className={classes.inner}>
        <Illustration className={classes.image} />
        <div className={classes.content}>
          <Title className={classes.title}>Nothing to see here</Title>
          <Text
            c="dimmed"
            size="lg"
            ta="center"
            className={classes.description}
          >
            Page you are trying to open does not exist.
          </Text>
          <Group justify="center">
            <Link to="/">
              <Button size="md">Take me back to home page</Button>
            </Link>
          </Group>
        </div>
      </div>
    </Container>
  );
}
