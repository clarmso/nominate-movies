import React, { useState } from "react";
import {
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  CircularProgress,
  Snackbar,
} from "@material-ui/core";

type MovieProps = {
  Title: string;
  Year: string;
  imdbID: string;
};

type ResultsProps = {
  term: string;
  movies: MovieProps[];
  isSearching: boolean;
};

const Results: React.FC<ResultsProps> = ({ term, movies, isSearching }) => {
  const [nominated, setNominated] = useState({
    0: false,
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
    8: false,
    9: false,
  });

  const handleNominate = movies.map((movie: MovieProps, index: number) => {
    return (event: React.MouseEvent) => {
      event.preventDefault();
      setNominated({ ...nominated, [index]: true });
    };
  });

  const handleRemoveNominate = movies.map(
    (movie: MovieProps, index: number) => {
      return (event: React.MouseEvent) => {
        event.preventDefault();
        setNominated({ ...nominated, [index]: false });
      };
    }
  );

  const nominatedContent: React.ReactElement[] = [];
  movies.map((movie: MovieProps, index: number) => {
    // @ts-ignore
    if (nominated[index]) {
      nominatedContent.push(
        <ListItem key={`result-${index}`}>
          • {movie.Title} ({movie.Year}){" "}
          <Button
            variant="contained"
            onClick={handleRemoveNominate[index]}
            key={index}
          >
            Remove
          </Button>
        </ListItem>
      );
    }
  });
  if (nominatedContent.length === 0) {
    nominatedContent.push(
      <ListItem key="no-nominations">
        <Typography variant="caption">No nominations...yet! 🥺</Typography>
      </ListItem>
    );
  }

  const resultsContent: React.ReactElement[] = [];
  if (term === "") {
    resultsContent.push(
      <ListItem key="enter-search">
        <Typography variant="caption">Please enter a movie title ☝️</Typography>
      </ListItem>
    );
  } else if (term !== "") {
    if (isSearching) {
      resultsContent.push(<CircularProgress />);
    } else if (movies.length === 0) {
      resultsContent.push(
        <ListItem key="no-movies">
          <Typography variant="caption">No Movies found 💩</Typography>
        </ListItem>
      );
    } else {
      movies.map((movie: MovieProps, index: number) => {
        resultsContent.push(
          <ListItem key={`nominate-${index}`}>
            • {movie.Title} ({movie.Year}){" "}
            <Button
              variant="contained"
              onClick={handleNominate[index]}
              key={index}
              // @ts-ignore
              disabled={nominated[index]}
            >
              Nominate
            </Button>
          </ListItem>
        );
      });
    }
  }

  return (
    <Grid container spacing={5}>
      <Snackbar
        open={nominatedContent.length >= 5}
        message="You have nominated 5 movies! 🎉"
      />
      <Grid item xs={6}>
        <Card>
          <CardContent>
            <Typography variant="h4" component="h2">
              Results {movies.length === 0 ? "" : `for "${term}"`}
            </Typography>
            <List>{resultsContent}</List>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6}>
        <Card>
          <CardContent>
            <Typography variant="h4" component="h2">
              Nominations
            </Typography>
            <List>{nominatedContent}</List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

Results.defaultProps = {
  term: "",
  movies: [],
  isSearching: false,
};

export default Results;
