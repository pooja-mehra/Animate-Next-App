import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Link from 'next/link';
import About from './about';

export default function SearchTerm (initialData:any){
    const router = useRouter()
    return(
        <div className="container">
            <Head>
                <title>EduAnimations for: {router.query.searchTerm}</title>
                <meta name="description" content={initialData.giphys.map((each:any, index:number) => each.title + ' ')}></meta>
                <link rel="icon" href="/favicon.ico" />
                <link rel="stylesheet" href="/styles.css"/>
            </Head>
            <p>Go <Link href="/">home</Link></p>
            <h1>Search results for: {router.query.searchTerm}</h1>
            <div className="giphy-search-results-grid">
                {initialData.giphys.map((each:any, index:number) => {
                    return(
                        <div key={index}>
                        <h3>{each.title}</h3>
                        <img src={each.images.original.url} alt={each.title}/>
                        </div>
                    )
                })}
            </div>
        <About />
        </div>
    )
}

export async  function getServerSideProps(context:any){
    const searchTerm = context.query.searchTerm
    let giphyObject = {data:[],pagination:{},meta:{}}
    let giphys = await fetch(`https://api.giphy.com/v1/gifs/search?q=${searchTerm}&api_key=StSxYeS5s923lQPhbYX9cZwplIcPUKrm&limit=10`)
    giphyObject = await giphys.json()
    return {props: {giphys: giphyObject.data}} 
}