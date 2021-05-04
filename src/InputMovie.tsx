import React from "react";
import {
  Grid,
  FormControl,
  InputLabel,
  Input,
  Card,
  CardContent,
} from "@material-ui/core";

export type InputMovieProps = {
  handleChangeSearchTerm: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const InputMovie: React.FC<InputMovieProps> = ({ handleChangeSearchTerm }) => {
  return (
    <Grid container spacing={5}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <FormControl>
              <InputLabel htmlFor="my-input">Movie Title</InputLabel>
              <Input
                id="my-input"
                onChange={handleChangeSearchTerm}
                autoFocus={true}
                data-testid="input-movie-title"
              />
            </FormControl>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default InputMovie;
