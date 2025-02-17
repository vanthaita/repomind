import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useRefetch from '@/hooks/use-refresh';
import { api } from '@/trpc/react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import EmojiConfetti from '@/components/Emoji';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaTimes, FaKey, FaProjectDiagram } from 'react-icons/fa';

type FormInput = {
  repoUrl: string;
  projectName: string;
  githubToken?: string;
};

type CreatePageProps = {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
};

const CreatePage = ({ isModalOpen, setIsModalOpen }: CreatePageProps) => {
  const { register, handleSubmit, reset } = useForm<FormInput>();
  const refetch = useRefetch();
  const createProject = api.project.createProject.useMutation();
  const [showConfetti, setShowConfetti] = useState(false);

  const onSubmit = async (data: FormInput) => {
    await createProject.mutateAsync({
      reponame: data.projectName,
      githubUrl: data.repoUrl,
      githubToken: data.githubToken,
    }, {
      onSuccess: () => {
        toast.success('Project created successfully!');
        refetch();
        setIsModalOpen(false);
        reset();
        setShowConfetti(true);
      },
      onError: () => {
        toast.error('Failed to create project. Please try again.');
      },
    });
  };

  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm z-[9999]"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-[#2A2A2A] rounded-xl p-8 w-full max-w-md border-2 border-[#333333] shadow-lg"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-green-500 flex items-center gap-2">
                <FaGithub className="text-green-500" />
                Link Repository
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-300 hover:text-green-500 text-3xl transition-colors duration-200"
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-green-200 mb-2 flex items-center gap-2">
                  <FaGithub className="text-green-500" />
                  Repository URL
                </label>
                <Input
                  {...register('repoUrl', { required: true })}
                  className="bg-[#333333] border-2 border-green-600/30 text-green-100 placeholder-green-300/50 focus:border-green-500 focus:ring-2 focus:ring-green-500/50 rounded-lg py-2 px-4 w-full"
                  placeholder="https://github.com/username/repo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-green-200 mb-2 flex items-center gap-2">
                  <FaProjectDiagram className="text-green-500" />
                  Project Name
                </label>
                <Input
                  {...register('projectName', { required: true })}
                  className="bg-[#333333] border-2 border-green-600/30 text-green-100 placeholder-green-300/50 focus:border-green-500 focus:ring-2 focus:ring-green-500/50 rounded-lg py-2 px-4 w-full"
                  placeholder="My Awesome Project"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-green-200 mb-2 flex items-center gap-2">
                  <FaKey className="text-green-500" />
                  GitHub Token (Optional)
                </label>
                <Input
                  type="password"
                  {...register('githubToken')}
                  className="bg-[#333333] border-2 border-green-600/30 text-green-100 placeholder-green-300/50 focus:border-green-500 focus:ring-2 focus:ring-green-500/50 rounded-lg py-2 px-4 w-full"
                  placeholder="••••••••••••"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600/90 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:shadow-green-glow disabled:opacity-50 flex items-center justify-center gap-2"
                disabled={createProject.isPending}
              >
                {createProject.isPending ? (
                  <span className="animate-pulse flex items-center gap-2">
                    <FaGithub className="animate-spin" />
                    Creating Project...
                  </span>
                ) : (
                  <>
                    <FaGithub />
                    Connect Repository
                  </>
                )}
              </Button>
            </form>
          </motion.div>
          {showConfetti && <EmojiConfetti trigger={showConfetti} />}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreatePage;