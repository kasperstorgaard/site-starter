import { html, render } from 'lit';
import './article.scss';

export default {
  title: 'Design System/Molecules/Article',
};


export function Primary() {
  const container = document.createElement('div');

  render(html`
    <article class="sg-article">
      <h1>Build from a subdirectory or monorepo</h1>
      <p class="sg-article__intro">
        Netlify allows you flexibility in how you organize and build a site or application. Although some sites are built directly from the root of a repository, others have a slightly more complex setup.
      </p>
      <p>
        To help you manage these more complex build configurations, Netlify offers options such as setting a base directory, controlling the volume of commit status notifications, and configuring a custom ignore command. You can also find setup recommendations below based on specific tools and project needs.
      </p>

      <h2 id="base-directory">
        <a href="#base-directory">#</a>Base directory
      </h2>
      <p>
        The base directory setting prompts our buildbots to change to the specified directory to detect dependencies and perform caching during the build process. It’s useful for building from a monorepo or subdirectory.
      </p>
      <p>
        You can set the base directory in the following ways, though the recommended method may differ depending on your project setup:
      </p>
      <ul>
      <li>in a <a href="/configure-builds/file-based-configuration/" class="">Netlify configuration file</a>. Use the <code>base</code> property under <code>[build]</code> settings as demonstrated in this <a href="/configure-builds/file-based-configuration/#sample-file" class="">sample <code>netlify.toml</code> file</a>. If you’re using a <code>netlify.toml</code> to set a base directory for a monorepo, the file must be at the root of the repository. You can include an additional <code>netlify.toml</code> in the base directory for all other site settings aside from <code>base</code>.</li>
        <li>
          in a Netlify configuration file. Use the base property under [build] settings as demonstrated in this sample netlify.toml file. If you’re using a netlify.toml to set a base directory for a monorepo, the file must be at the root of the repository. You can include an additional netlify.toml in the base directory for all other site settings aside from base.
        </li>
        <li>
          using Netlify CLI when setting up continuous deployment for a site. Change to the subdirectory that you’d like to set as the base, then run the netlify init command. The current working directory is then specified as the base.
        </li>
      </ul>
      <p>
        If not explicitly set, the base directory defaults to the root of the repository. A base directory specified in a root-level netlify.toml overrides the UI setting.
      </p>
    </article>
  `, container);

  return container;
}
