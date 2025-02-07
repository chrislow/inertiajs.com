import React from 'react'
import dedent from 'dedent-js'
import { A, H1, H2, Layout, Notice, P, TabbedCode } from '@/Components'

const meta = {
  title: 'Error handling',
  links: [
    { url: '#development', name: 'Development' },
    { url: '#production', name: 'Production' },
  ],
}

const Page = () => {
  return (
    <>
      <H1>Error handling</H1>
      <H2>Development</H2>
      <P>
        One of the nice things about working with a server-side framework is the built-in exception handling you get for
        free. For example, Laravel ships with <A href="https://github.com/facade/ignition">Ignition</A>, a beautiful
        error reporting tool which displays a nicely formatted stack trace in local development.
      </P>
      <P>
        The challenge is, if you're making an XHR request (which Inertia does), and you hit a server-side error, you're
        typically left digging through the network tab in your browser's devtools.
      </P>
      <P>
        Inertia solves this by showing all non-Inertia responses in a modal. Meaning you get the same beautiful
        error-reporting, even though you've made that request over XHR!
      </P>
      <div className="my-6 relative rounded overflow-hidden bg-gray-500" style={{ paddingTop: '80.5%' }}>
        <div className="absolute inset-0 w-full h-full flex items-center justify-center text-sm">Loading&hellip;</div>
        <iframe
          className="absolute inset-0 w-full h-full"
          src="https://player.vimeo.com/video/363562630?autoplay=1&loop=1&muted=1&background=1"
        ></iframe>
      </div>
      <Notice>Note, the modal behaviour is only intended for development purposes.</Notice>
      <H2>Production</H2>
      <P>
        In production you'll want to return a proper Inertia error response instead of relying on the modal behaviour.
        To do this you'll need to update your framework's default exception handler to return a custom error page.
      </P>
      <TabbedCode
        examples={[
          {
            name: 'Laravel',
            language: 'php',
            description: 'Extend the render() method in your App\\Exceptions\\Handler.php.',
            code: dedent`
              use Throwable;
              use Inertia\\Inertia;\n
              /**
               * Prepare exception for rendering.
               *
               * @param  \\Throwable  $e
               * @return \\Throwable
               */
              public function render($request, Throwable $e)
              {
                  $response = parent::render($request, $e);\n
                  if (!app()->environment(['local', 'testing']) && in_array($response->getStatusCode(), [500, 503, 404, 403])) {
                      return Inertia::render('Error', ['status' => $response->getStatusCode()])
                          ->toResponse($request)
                          ->setStatusCode($response->getStatusCode());
                  } else if ($response->getStatusCode() === 419) {
                      return back()->with([
                          'message' => 'The page expired, please try again.',
                      ]);
                  }\n
                  return $response;
              }
            `,
          },
          {
            name: 'Rails',
            language: 'ruby',
            code: dedent`
              # todo
            `,
          },
        ]}
      />
      <P>
        Notice how we're returning an `Error` page component in the example above. You'll need to actually create this.
        Here's an example error page component you can use as a starting point.
      </P>
      <TabbedCode
        examples={[
          {
            name: 'Vue 2',
            language: 'twig',
            code: dedent`
              <template>
                <div>
                  <H1>{{ title }}</H1>
                  <div>{{ description }}</div>
                </div>
              </template>\n
              <script>
              export default {
                props: {
                  status: Number,
                },
                computed: {
                  title() {
                    return {
                      503: '503: Service Unavailable',
                      500: '500: Server Error',
                      404: '404: Page Not Found',
                      403: '403: Forbidden',
                    }[this.status]
                  },
                  description() {
                    return {
                      503: 'Sorry, we are doing some maintenance. Please check back soon.',
                      500: 'Whoops, something went wrong on our servers.',
                      404: 'Sorry, the page you are looking for could not be found.',
                      403: 'Sorry, you are forbidden from accessing this page.',
                    }[this.status]
                  },
                },
              }
              </script>
            `,
          },
          {
            name: 'Vue 3',
            language: 'twig',
            code: dedent`
              <template>
                <div>
                  <H1>{{ title }}</H1>
                  <div>{{ description }}</div>
                </div>
              </template>\n
              <script>
              export default {
                props: {
                  status: Number,
                },
                computed: {
                  title() {
                    return {
                      503: '503: Service Unavailable',
                      500: '500: Server Error',
                      404: '404: Page Not Found',
                      403: '403: Forbidden',
                    }[this.status]
                  },
                  description() {
                    return {
                      503: 'Sorry, we are doing some maintenance. Please check back soon.',
                      500: 'Whoops, something went wrong on our servers.',
                      404: 'Sorry, the page you are looking for could not be found.',
                      403: 'Sorry, you are forbidden from accessing this page.',
                    }[this.status]
                  },
                },
              }
              </script>
            `,
          },
          {
            name: 'React',
            language: 'jsx',
            code: dedent`
              import React from 'react'\n
              export default function ErrorPage({ status }) {
                const title = {
                  503: '503: Service Unavailable',
                  500: '500: Server Error',
                  404: '404: Page Not Found',
                  403: '403: Forbidden',
                }[status]\n
                const description = {
                  503: 'Sorry, we are doing some maintenance. Please check back soon.',
                  500: 'Whoops, something went wrong on our servers.',
                  404: 'Sorry, the page you are looking for could not be found.',
                  403: 'Sorry, you are forbidden from accessing this page.',
                }[status]\n
                return (
                  <div>
                    <H1>{title}</H1>
                    <div>{description}</div>
                  </div>
                )
              }
            `,
          },
          {
            name: 'Svelte',
            language: 'html',
            code: dedent`
              <script>
                export let status\n
                $: title = {
                  503: '503: Service Unavailable',
                  500: '500: Server Error',
                  404: '404: Page Not Found',
                  403: '403: Forbidden',
                }[status]\n
                $: description = {
                  503: 'Sorry, we are doing some maintenance. Please check back soon.',
                  500: 'Whoops, something went wrong on our servers.',
                  404: 'Sorry, the page you are looking for could not be found.',
                  403: 'Sorry, you are forbidden from accessing this page.',
                }[status]
              </script>\n
              <div>
                <H1>{title}</H1>
                <div>{description}</div>
              </div>
            `,
          },
        ]}
      />
    </>
  )
}

Page.layout = page => <Layout children={page} meta={meta} />

export default Page
