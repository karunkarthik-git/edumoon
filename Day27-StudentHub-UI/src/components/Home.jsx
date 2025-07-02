import { useEffect, useState } from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';  

const Home = () => {

    const [posts, setPosts] = useState([]);
    
    const fetchPosts = async () => {
        try {
            const url = import.meta.env.VITE_SH_BE_URI + 'api/v1/posts';
            const response = await axios.get(url, {
                headers: {
                    Authorization: localStorage.getItem('token'),
                    'Content-Type': 'application/json',
                }
            });
            setPosts(response.data.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const PostCard = ({ post }) => {
        return (
            <Card>
                <Card.Img variant="top" src={post.file_url} />
                <Card.Body>
                    <Card.Title>{post.title}</Card.Title>
                    <Card.Text>
                        {post.content}
                    </Card.Text>

                </Card.Body>
            </Card>
        );
    };

    return (
        <>
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                <h1 className="text-4xl font-bold mb-4">Welcome to StudentHub</h1>
                <p className="text-lg text-gray-700">Your collaborative learning platform</p>
            </div>
            <div className="flex justify-center mt-8">
                <Row xs={1} md={2} className="g-4">
                    {posts.map((post) => (
                        <Col key={post.post_id}>
                            <PostCard post={post} />
                        </Col>
                    ))}
                </Row>
            </div>
        </>
    )
}

export default Home;