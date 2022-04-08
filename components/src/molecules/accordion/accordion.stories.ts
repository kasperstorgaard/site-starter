import { html, render } from 'lit';
import { map } from 'lit/directives/map.js';
import { range } from 'lit/directives/range.js';
import './accordion';
import './accordion.scss';

export default {
  title: 'Design System/Molecules/Accordion',
  args: {
    mode: 'multi',
  },
  argTypes: {
    mode: {
      options: ['multi', 'single'],
      control: 'select',
    },
  }
};

interface Options {
  numberOfItems: number;
  mode?: 'multi'|'single';
}

export function Primary(args: Options) {
  const container = document.createElement('div');

  render(html`
    <sg-accordion mode=${args.mode ?? 'multi'}>
      <details>
        <summary>How many species of wolves are there in the world?</summary>
        <p>There are two universally recognized species of wolves in the world: the gray wolf (<i>Canis lupus</i>) and the red wolf (<i>Canis rufus</i>). Two other members of the canine family are considered to be wolves by some researchers and other species by other researchers. The use of molecular genetic research on wolves is suggesting that there may be two more species of wolf in the world. Some scientists question whether the Ethiopian or Abyssinian wolf (<i>Canis simensis</i>) is a true wolf or a jackal. Other researchers have presented strong evidence that the eastern timber wolf (<i>Canis lupus lycaon</i>), may be a distinct species, the eastern wolf (<i>Canis lycaon</i>). Due to the complex nature of studying wolves using molecular genetics to distinguish species, the process takes a great amount of time to reach solid conclusions.</p>
      </details>
      <details>
        <summary>What are the subspecies (races) of the gray wolf?</summary>
        <p>Subspecies are often difficult to distinguish from one another. This is because wolves are so mobile and travel such great distances. They interbreed where their ranges overlap so that their populations tend to blend together rather than form distinctive boundaries. The different traits we see in subspecies are likely the result of geographic range, available habitat, and prey base. But one wolf is, in reality, like any other wolf in terms of natural history and behavior. There are far more commonalities among wolves than differences. All species and subspecies of wolves are social animals that live and hunt in families called packs, although adult wolves can and do survive alone. Most wolves hold territories, and all communicate through body language, vocalization and scent marking.</p>
      </details>
      <details>
        <summary>Is the red wolf a true wolf or a wolf/coyote hybrid?</summary>
        <p>No single hypothesis for the origin of the red wolf is universally accepted by scientists. DNA analysis and morphological evidence support recognition of the red wolf as a distinct species. (See&nbsp;<i>Wolves: Behavior, Ecology, and Conservation</i>&nbsp;– Chapter 9).</p>
      </details>
    </sg-accordion>
  `, container);

  return container;
}

export function ManyItems(args: Options) {
  const container = document.createElement('div');

  render(html`
    <sg-accordion mode=${args.mode ?? 'multi'}>
      <details>
        <summary>Can a star turn into a planet?</summary>
        <p>Yes, a star can turn into a planet, but this transformation only happens for a very particular type of star known as a brown dwarf.</p>
      </details>
      <details>
        <summary>Can gravity form waves?</summary>
        <p>Yes, gravity can forms waves. Gravitational waves are ripples in spacetime that travel through the universe.</p>
      </details>
      <details>
        <summary>Does every black hole contain a singularity?</summary>
        <p>In the real universe, no black holes contain singularities. In general, singularities are the non-physical mathematical result of a flawed physical theory.</p>
      </details>
      <details>
        <summary>Does sound travel faster in space?</summary>
        <p>Sound does not travel at all in space. The vacuum of outer space has essentially zero air.</p>
      </details>
      <details>
        <summary>Have aliens ever visited earth?</summary>
        <p>According to the findings of mainstream science, aliens have never visited the earth. Despite the whimsical fantasies of fictional works and the confusion of supposed eye-witnesses, there is no credible scientific evidence that aliens have ever visited the earth.</p>
      </details>
      <details>
        <summary>How does a black hole give off light?</summary>
        <p>A black hole itself does not give off any light. That is why it is called black. However, matter that is near a black hole can give off light in response to the black hole's gravity.</p>
      </details>
      <details>
        <summary>What makes space so cold?</summary>
        <p>Space is not always cold. It depends if you are facing the sun or not. And even if you are in shadow, space is not cold in the sense that it will cool you down quickly. The part of an astronaut facing the sun becomes blazing hot while the side in shadow remains a moderate temperature due to the suits internal machinery.</p>
      </details>
      <details>
        <summary>What keeps the North Star stuck at exactly North?</summary>
        <p>First of all, the North Star (that dot that earthlings currently see in the night sky when looking North) is not actually a single star. The North Star, also called Polaris, is a multiple star system which actually consists of five different stars. Three of these stars are relatively close to each other and are in orbit around each other. The two others are very distant from these first three, and just appear at the same point in the sky by random chance because they lie on the same line of sight from earth. If viewed from another galaxy, these two other stars would not line up and would not appear to be a part of the main Polaris system. The brightest star of the main system is a supergiant, and the other two stars are smaller and orbit around it.</p>
        <p>Secondly, none of the stars in the sky really move over the course of a single day. They are all stuck in place. (The stars do have movement, but these movement are measured in millions of years and not days.) The stars seem to all sweep across the sky every night because the earth is rotating. The earth rotates on its axis once a day. As a result, all of the stars in the sky sweep through great arcs and take about a day to return back their original location</p>
      </details>
    </sg-accordion>
  `, container);

  return container;
}


export function SingleMode(args: Options) {
  const container = document.createElement('div');

  render(html`
    <sg-accordion mode=${args.mode ?? 'multi'}>
      <details>
        <summary>Which is the tallest animal in the world?</summary>
        <p>Answer: Giraffe</p>
      </details>
      <details>
        <summary>Which animal has the longest lifeline?</summary>
        <p>Answer: The arctic whale</p>
      </details>
      <details>
        <summary>How many legs does an octopus have?</summary>
        <p>Answer: Eight</p>
      </details>
      <details>
        <summary>Mention one flightless bird.</summary>
        <p>Answer: Ostrich</p>
      </details>
      <details>
        <summary>Which bird is the symbol of peace?</summary>
        <p>Answer: Dove</p>
      </details>
    </sg-accordion>
  `, container);

  return container;
}

SingleMode.args = {
  mode: 'single',
};
