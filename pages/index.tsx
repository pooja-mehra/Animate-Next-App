import Image from 'next/image'
import { Inter } from 'next/font/google'
import Head from 'next/head'
import { useEffect ,useState} from 'react'
import Grid from '@mui/material/Grid';
import SearchAppBar from './appbar/SearchAppBar'
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import Link from 'next/link';
import About from './search/about';

export default function Home(initialData:any) {
  const [searchTerm, setSearchTerm] = useState('dogs')
  const [searchResults, setSearchResults] = useState([])

  useEffect(()=>{
    setSearchResults(initialData.cats.data)
  }, [initialData])

  function srcset(image: string, width: number, height: number, rows = 1, cols = 1) {
    return {
      src: `${image}?w=${width * cols}&h=${height * rows}&fit=crop&auto=format`,
      srcSet: `${image}?w=${width * cols}&h=${
        height * rows
      }&fit=crop&auto=format&dpr=2 2x`,
    };
  }

  const searchTermFun = async (formInputs:any) =>{
    let giphyObject = {data:[],pagination:{},meta:{}}
    console.log(formInputs.searchTerm)
    if(formInputs.searchTerm != searchTerm){
      let giphys = await fetch(`https://api.giphy.com/v1/gifs/search?q=${formInputs.searchTerm}&api_key=StSxYeS5s923lQPhbYX9cZwplIcPUKrm&limit=6`)
      giphyObject = await giphys.json()
      console.log(giphyObject)
      setSearchResults(giphyObject.data)
      setSearchTerm(formInputs.searchTerm)
      console.log(searchResults)
      
    }
    //setSearchResults(giphys.formData)
  }

  return (
    <div className='container'>
    <link rel="stylesheet" href="/styles.css"/>
    <Head>
        <title>EduAnimate Next</title>
        <meta name="description" content="Interactive Animations to enhance your learning in a fun way!."></meta>
        <link rel="icon" href="/favicon.ico" />
    </Head>
    <SearchAppBar getSearchTerm = {searchTermFun}/>
    <div style={{marginTop:'10%'}}>
    <p>Share this search with others:
      <Link
            href="/search/[pid]"
            as={`/search/${searchTerm}`}>
                {`http://localhost:3000/search/${searchTerm}`}
      </Link>
     
        </p>
      </div>
    <ImageList
      style={{marginLeft:'15%',border:'solid'}}
      sx={{
        width: 500,
        height: 450,
        // Promote the list into its own layer in Chrome. This costs memory, but helps keeping high FPS.
        transform: 'translateZ(0)',
      }}
      rowHeight={200}
      gap={1}
    >
      {searchResults.map((item:any) => {
        const cols = 1;
        const rows = 2;

        return (
          <ImageListItem key={item.images.original.url} cols={cols} rows={rows} >
            <img
              {...srcset(item.images.original.url, 250, 200, rows, cols)}
              alt={item.title}
              loading="lazy"
            />
            <ImageListItemBar
              sx={{
                background:
                  'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                  'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
              }}
              title={item.title}
              position="top"
              actionIcon={
                <IconButton
                  sx={{ color: 'white' }}
                  aria-label={`star ${item.title}`}
                >
                  <StarBorderIcon />
                </IconButton>
              }
              actionPosition="left"
            />
          </ImageListItem>
        );
      })}
    </ImageList>
    <Grid container spacing={12} style={{margin:'5%'}} >
    {searchResults.map((each:any, index:number) => {
      return(
        <Grid xs={6} md={3} display="flex" justifyContent="center" alignItems="center" style={{margin:'5%' ,border:'solid'}}>
          <div key={index}>
            <h3>{each.title}</h3>
            <img src={each.images.original.url} alt={each.title}/>
          </div>
        </Grid>
      )
    })}
    </Grid>
    <About />
    </div>
  )
}

export async function getStaticProps(){
  let cats = await fetch('https://api.giphy.com/v1/gifs/search?q=dogs&api_key=StSxYeS5s923lQPhbYX9cZwplIcPUKrm&limit=10')
  cats = await cats.json()
  return {props:{cats:cats}}
}
