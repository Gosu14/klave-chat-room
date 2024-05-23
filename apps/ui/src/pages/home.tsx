import { Helmet } from 'react-helmet-async';

export const Home = () => {
    return (
        <>
            <Helmet>
                <title>Home | Chat App</title>
            </Helmet>
            <div className="flex flex-col p-4">
                <h1 className="text-2xl font-semibold">Home</h1>
                <p className="pt-8 italic">Welcome to Chat App!</p>
            </div>
        </>
    );
};
