'use client'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/trpc/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
type FormInput = {
    repoUrl: string;
    projectName: string;
    githubToken?: string;
};

const CreatePage = () => {
    const { register, handleSubmit, reset } = useForm<FormInput>();
    const createProject = api.project.createProject.useMutation();
    const onSubmit = (data: FormInput) => {
        createProject.mutate({
            reponame: data.projectName,
            githubUrl: data.repoUrl,
            githubToken: data.githubToken,
        }, 
        {
            onSuccess: () => {
                toast.success("Project created successfully!")
            },
            onError: (error) => {
                toast.error('Error creating project!');
            },
            
        });
        reset();
    };

    return (
        <div className='flex items-center gap-12 h-full justify-center'>
            <div className='max-w-md w-full'>
                <div className='text-center mb-8'>
                    <h1 className='text-2xl font-bold'>
                        Link your GitHub Repository
                    </h1>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                    <div>
                        <label htmlFor="repoUrl" className='block text-sm font-medium text-gray-700'>
                            Repository URL
                        </label>
                        <Input
                            id="repoUrl"
                            type="url"
                            {...register('repoUrl', { required: true })}
                            className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                            placeholder='https://github.com/username/repo'
                        />
                    </div>
                    <div>
                        <label htmlFor="projectName" className='block text-sm font-medium text-gray-700'>
                            Project Name
                        </label>
                        <Input
                            id="projectName"
                            type="text"
                            {...register('projectName', { required: true })}
                            className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                            placeholder='My Awesome Project'
                        />
                    </div>
                    <div>
                        <label htmlFor="githubToken" className='block text-sm font-medium text-gray-700'>
                            GitHub Token (Optional)
                        </label>
                        <Input
                            id="githubToken"
                            type="password"
                            {...register('githubToken')}
                            className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                            placeholder='Enter your GitHub token'
                        />
                    </div>
                    <div>
                        <Button
                            type="submit"
                            className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white'
                            disabled={createProject.isPending}
                        >
                            Link Repository
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePage;