import axios from "axios";
import "./App.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

function App() {
    const queryClient = useQueryClient();

    const [title, setTitle] = useState("");
    const [views, setViews] = useState("");

    const [selectedPostId, setSelectedPostId] = useState(null);

    const getPosts = async () => {
        const response = await axios.get("http://localhost:4000/posts");
        return response.data;
    };

    const addPost = async (newPost) => {
        await axios.post("http://localhost:4000/posts", {
            title: newPost.title,
            views: newPost.views,
        });
    };

    const getProfile = async () => {
        const response = await axios.get("http://localhost:4000/profile");
        return response.data;
    };

    const getComments = async (id) => {
        const response = await axios.get("http://localhost:4000/comments?postId=" + id);
        return response.data;
    };

    const { data, isLoading, isError } = useQuery({
        queryKey: ["posts"],
        queryFn: getPosts,
    });

    const {
        data: profileData,
        isLoading: profileIsLoading,
        isError: profileIsError,
    } = useQuery({
        queryKey: ["profile"],
        queryFn: getProfile,
    });

    const {
        data: commentsData,
        isLoading: commentsIsLoading,
        isError: commentsIsError,
    } = useQuery({
        queryKey: ["comments", selectedPostId],
        queryFn: ({ queryKey }) => getComments(queryKey[1]),
        enabled: !!selectedPostId,
    });

    const mutation = useMutation({
        mutationFn: addPost,
        onSuccess: () => {
            queryClient.invalidateQueries(["posts"]);
        },
    });

    const handleComments = (id) => {
        setSelectedPostId(id);
    };

    if (isLoading) {
        return <div>로딩중입니다...</div>;
    }

    if (isError) {
        return <div>오류가 발생하였습니다...</div>;
    }

    if (profileIsLoading) {
        return <div>로딩중입니다...</div>;
    }

    if (profileIsError) {
        return <div>오류가 발생하였습니다...</div>;
    }

    if (commentsIsLoading) {
        return <div>로딩중입니다...</div>;
    }

    if (commentsIsError) {
        return <div>오류가 발생하였습니다...</div>;
    }

    return (
        <>
            <input value={title} onChange={(e) => setTitle(e.target.value)} />
            <input value={views} onChange={(e) => setViews(e.target.value)} />
            <button onClick={() => mutation.mutate({ title, views })}>추가</button>
            {data.map((post) => {
                return (
                    <div key={post.id}>
                        {post.title} (views: {post.views})<button onClick={() => handleComments(post.id)}>댓글보기</button>
                        <div>
                            {selectedPostId === post.id &&
                                commentsData?.map((comment) => {
                                    return <div key={comment.id}>{comment.text}</div>;
                                })}
                        </div>
                    </div>
                );
            })}
            <hr />
            {profileData.name}
        </>
    );
}

export default App;
