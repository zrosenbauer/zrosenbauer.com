import type { Project } from "@content";
import Link from "next/link";
import { Star } from "lucide-react";
import _ from "lodash";

import { useGitHubApi } from "@utils/github/client";

export const ProjectCard: React.FC<{
	project: Project;
}> = ({ project }) => {
	const [owner, repo] = project.repository.split("/");
	const { data } = useGitHubApi("GET /repos/{owner}/{repo}", {
		owner,
		repo,
	});

	if (!data) {
		return null;
	}

	return (
		<Link href={`/projects/${project.slug}`}>
			<article className="p-4 md:p-8">
				<div className="flex justify-between gap-2 items-center">
					<span className="text-zinc-500 text-xs  flex items-center gap-1">
						<Star className="w-4 h-4" />{" "}
						{Intl.NumberFormat("en-US", { notation: "compact" }).format(data.stargazers_count)}
					</span>
				</div>
				<h2 className="z-20 text-xl font-medium duration-1000 lg:text-3xl text-zinc-200 group-hover:text-white font-display">
					{project.title}
				</h2>
				<p className="z-20 mt-4 text-sm  duration-1000 text-zinc-400 group-hover:text-zinc-200">
					{data.description}
				</p>
			</article>
		</Link>
	);
};
