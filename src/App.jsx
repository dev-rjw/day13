import axios from "axios";
import "./App.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

function App() {
    const queryClient = useQueryClient();

    const [title, setTitle] = useState("");
    const [views, setViews] = useState("");

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

    const { data, isLoading, isError } = useQuery({
        queryKey: ["posts"],
        queryFn: getPosts,
    });

    const mutation = useMutation({
        mutationFn: addPost,
        onSuccess: () => {
            queryClient.invalidateQueries(["posts"]);
        },
    });

    if (isLoading) {
        return <div>로딩중입니다...</div>;
    }

    if (isError) {
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
                        {post.title} (views: {post.views})
                    </div>
                );
            })}
        </>
    );
}

export default App;
