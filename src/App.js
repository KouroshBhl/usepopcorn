import { useEffect, useState } from 'react';
import Star from './Star';

const tempMovieData = [
  {
    imdbID: 'tt1375666',
    Title: 'Inception',
    Year: '2010',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
  },
  {
    imdbID: 'tt0133093',
    Title: 'The Matrix',
    Year: '1999',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg',
  },
  {
    imdbID: 'tt6751668',
    Title: 'Parasite',
    Year: '2019',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg',
  },
];

const tempWatchedData = [
  {
    imdbID: 'tt1375666',
    Title: 'Inception',
    Year: '2010',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: 'tt0088763',
    Title: 'Back to the Future',
    Year: '1985',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg',
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = `51b156c0`;
const API = `http://www.omdbapi.com/?apikey=`;
// const query = 'inception';

// !Structural Component
export default function App() {
  const [query, setQuery] = useState('test');
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectId, setSelectId] = useState(null);

  function handleCloseMovie() {
    setSelectId(null);
  }

  useEffect(
    function () {
      async function getMovies() {
        try {
          setIsLoading(true);
          setError('');
          const res = await fetch(`${API}${KEY}&s=${query}`);
          if (!res.ok) throw new Error('Something went wrong!');

          const data = await res.json();
          if (data.Response === 'False') throw new Error('Movie not found!');

          setMovies(data.Search);
        } catch (error) {
          setError(error.message);
        } finally {
          setIsLoading(false);
        }
      }
      if (query.length < 3) {
        setError('Please start searching!');
        return;
      }

      getMovies();
    },
    [query]
  );

  return (
    <>
      <Navbar>
        <Search query={query} setQuery={setQuery} />
        <NumSearch movies={movies} />
      </Navbar>
      <Main>
        <MovieBox>
          {/* {isLoading ? <Loading /> : <MovieList movies={movies} />} */}
          {isLoading && <Loading />}
          {!isLoading && !error && (
            <MovieList movies={movies} setSelectId={setSelectId} />
          )}
          {error && <ErrorMessage message={error} />}
        </MovieBox>
        <MovieBox>
          {selectId ? (
            <MovieDetails
              selectId={selectId}
              setWatched={setWatched}
              onCloseMovie={handleCloseMovie}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedList watched={watched} />
            </>
          )}
        </MovieBox>
      </Main>
    </>
  );
}

function MovieDetails({ selectId, setWatched, onCloseMovie, watched }) {
  const [selectedMovie, setSelectedMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectId);

  const userRated = watched.find(
    (movie) => movie.imdbID === selectId
  )?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = selectedMovie;

  useEffect(() => {
    async function onSearchHandler() {
      setIsLoading(true);
      try {
        const res = await fetch(`${API}${KEY}&i=${selectId}`);
        const data = await res.json();
        setSelectedMovie(data);
      } catch (error) {
        console.log(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    onSearchHandler();
  }, [selectId]);

  function handleAddToWatched() {
    const addMovieToList = {
      title,
      imdbID: selectId,
      year,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(' ').at(0)),
      poster,
      userRating,
    };

    setWatched((watched) => [...watched, addMovieToList]);
    onCloseMovie();
  }

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className='details'>
          <header>
            <button className='btn-back' onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${title} movie`} />
            <div className='details-overview'>
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>

          {/* <p>{avgRating}</p> */}

          <section>
            <div className='rating'>
              {!isWatched ? (
                <>
                  <Star
                    color='#facc15'
                    starLength={10}
                    size={24}
                    onSetRating={setUserRating}
                  />

                  {userRating > 0 && (
                    <button className='btn-add' onClick={handleAddToWatched}>
                      + Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>
                  You rated this movie <span>{userRated} ⭐️</span>
                </p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </div>
      )}
    </>
  );
}

function Loading() {
  return <p className='loader'>Loading...</p>;
}

function ErrorMessage({ message }) {
  return (
    <p className='error'>
      <span>❌</span> {message}
    </p>
  );
}

// !Structural Component
function Navbar({ children }) {
  return (
    <nav className='nav-bar'>
      <Logo />
      {children}
    </nav>
  );
}

// !Presentation Component
function Logo() {
  return (
    <div className='logo'>
      <span role='img'>🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

// !Stateful Component
function Search({ query, setQuery }) {
  return (
    <input
      className='search'
      type='text'
      placeholder='Search movies...'
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

// !Presentation Component
function NumSearch({ movies }) {
  return (
    <p className='num-results'>
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

// !Stractural Component
function Main({ children }) {
  return <main className='main'>{children}</main>;
}

function MovieBox({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className='box'>
      <button className='btn-toggle' onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? '–' : '+'}
      </button>
      {isOpen && children}
    </div>
  );
}

// !Presentational Component
function MovieList({ movies, setSelectId }) {
  return (
    <ul className='list list-movies'>
      {movies?.map((movie) => (
        <MovieItem
          movie={movie}
          key={movie.imdbID}
          onClick={() => setSelectId(movie.imdbID)}
        />
      ))}
    </ul>
  );
}

// !Stractural Component
function MovieItem({ movie, onClick }) {
  return (
    <li onClick={onClick}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

// !Stateful Component
function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className='summary'>
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

// !Presentational Component
function WatchedList({ watched }) {
  return (
    <ul className='list'>
      {watched.map((movie) => (
        <WatchedItem key={movie.imdbID} movie={movie} />
      ))}
    </ul>
  );
}

// !presenation Component
function WatchedItem({ movie }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime}min</span>
        </p>
      </div>
    </li>
  );
}
