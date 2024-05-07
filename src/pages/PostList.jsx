import { useEffect, useState } from 'react';
import Layout from '../components/Layout'
import { client } from '../lib/createClient';
import { Link } from "react-router-dom";

const PostList = () => {
    const [categories, setCategories] = useState([]);
    const [posts, setPosts] = useState([]);
    const [totalPosts, setTotalPosts] = useState(0);
    const [pageNumbers, setPageNumbers] = useState([]);
    const [skip, setSkip] = useState(0);
    const [perPage, setPerPage] = useState(5);

    const perPageOptions = {
        '2 por página': 2,
        '5 por página': 5,
        '8 por página': 8,
    };

    useEffect(() => {
        client
            .getEntries({
                content_type: 'blogPost',
                skip: skip,
                limit: perPage,
                order: '-sys.createdAt'
            })
            .then((entries) => {
                setPosts(entries.items);
                setTotalPosts(entries.total);
                setPageNumbers([]);

                for (let i = 1; i <= Math.ceil(entries.total / perPage); i++) {
                    setPageNumbers(pageNumbers => [...pageNumbers, i]);
                }
            });
    }, [skip, perPage]);

    useEffect(() => {
        client
            .getEntries({
                content_type: 'blogCategory',
                order: 'sys.createdAt'
            })
            .then((entries) => {
                setCategories(entries.items);
            });
    }, []);

    function agregateSkip() {
        if (skip + perPage <= totalPosts) {
            setSkip(skip => skip + perPage);
        }
    }

    function disaggregateSkip() {
        if (skip - perPage >= 0) {
            setSkip(skip => skip - perPage);
        }
    }

    function numberSkip(pageNumber) {
        setSkip((pageNumber - 1) * perPage);
    }

    function changePerPage(e) {
        setPerPage(parseInt(e.target.value));
        setSkip(0);
    }

    return (
        <>
            <Layout>
                <div className="container">
                    <div className="row">
                        <main className="col-md-8">
                            <h1 className="my-3">Todos os Posts</h1>

                            {posts.map((post) => {
                                return (
                                    <div className="card mb-3" key={post.sys.id}>
                                        <div className="card-body">
                                            <h5 className="card-title">{post.fields.postTitle}</h5>
                                            <p className="card-text">{post.fields.postDescription}</p>
                                            <Link to={`/post/${post.fields.postSlug}`} className="card-link">
                                                Ver Post
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}

                            <div className='d-flex flex-row justify-content-between'>
                                <div>
                                    <select className="form-control" value={perPage} onChange={e => changePerPage(e)}>
                                        {Object.entries(perPageOptions).map((c, index) => (
                                            <option key={index} value={c[1]}>{c[0]}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="ml-auto">
                                    <ul className="pagination">
                                        <li className="page-item">
                                            <button className="page-link" onClick={disaggregateSkip}>Previous</button>
                                        </li>
                                        {pageNumbers.map((number) => (
                                            <li className={`page-item ${number == (skip / perPage) + 1 && 'active'}`} key={number}>
                                                <button className="page-link" onClick={() => numberSkip(number)}>{number}</button>
                                            </li>
                                        ))}
                                        <li className="page-item">
                                            <button className="page-link" onClick={agregateSkip}>Next</button>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <Link to={`/`} className="btn btn-primary">
                                Voltar Para Home
                            </Link>
                        </main>

                        <aside className="col-md-4">
                            <h2>Categorias</h2>
                            <ul>
                                {categories.map((category) => {
                                    return (
                                        <li key={category.sys.id}>{category.fields.categoryTitle}</li>
                                    );
                                })}
                            </ul>
                        </aside>
                    </div>
                </div>
            </Layout>
        </>
    );
}

export default PostList;